import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { LinkService } from './link.service';
import { PrismaService } from '../../prisma/prisma.service';

//jest.fn() = fonction espion qui permet de simuler le comportement des méthodes Prisma
const mockPrismaService = {
  link: {
    create: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('LinkService', () => {
  let service: LinkService;
  let prismaService: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LinkService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<LinkService>(LinkService);
    prismaService = module.get(PrismaService);
  });

  // Nettoie les mocks après chaque test
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test sanity check
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllLinksForUser', () => {
    it('should return user links successfully', async () => {
      // ARRANGE
      const userId = 'user123';
      const mockLinks = [
        {
          id: 'link1',
          title: 'Link 1',
          url: 'https://example1.com',
          userId: userId,
        },
        {
          id: 'link2',
          title: 'Link 2',
          url: 'https://example2.com',
          userId: userId,
        },
      ];

      prismaService.link.findMany.mockResolvedValue(mockLinks);

      // ACT
      const result = await service.getAllLinksForUser(userId);

      // ASSERT
      expect(result).toEqual({
        status: 'success',
        links: mockLinks,
      });
      expect(prismaService.link.findMany).toHaveBeenCalledWith({
        where: { userId },
      });
    });

    it('should throw BadRequestException when userId is missing', async () => {
      // ACT & ASSERT
      await expect(service.getAllLinksForUser('')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.getAllLinksForUser('')).rejects.toThrow(
        'User ID is required',
      );
    });

    it('should return empty links array when user has no links', async () => {
      // ARRANGE
      const userId = 'user123';
      prismaService.link.findMany.mockResolvedValue([]);

      // ACT
      const result = await service.getAllLinksForUser(userId);

      // ASSERT
      expect(result).toEqual({
        status: 'success',
        links: [],
      });
    });
  });

  describe('createLink', () => {
    it('should create a link successfully', async () => {
      // ARRANGE
      const mockLinkData = {
        title: 'Test Link',
        url: 'https://example.com',
        description: 'Test description',
        userId: 'user123',
      };

      const createLinkDto = {
        title: 'Test Link',
        url: 'https://example.com',
        userId: 'user123',
      };

      const expectedLink = {
        id: 'link123',
        title: 'Test Link',
        slug: 'test-link',
        url: 'https://example.com',
        userId: 'user123',
      };

      prismaService.link.create.mockResolvedValue(expectedLink);

      // ACT
      const result = await service.createLink(
        mockLinkData,
        // 'user123',
        // createLinkDto,
      );

      // ASSERT
      expect(result).toEqual({
        status: 'success',
        message: 'Link created successfully',
        link: expectedLink,
      });
      expect(prismaService.link.create).toHaveBeenCalledWith({
        data: {
          title: createLinkDto.title,
          slug: expect.any(String), // Le slug est généré
          url: createLinkDto.url,
          userId: createLinkDto.userId,
        },
      });
    });
  });

  describe('updateLink', () => {
    it('should update a link successfully', async () => {
      // ARRANGE
      const updateData = {
        linkId: 'link123',
        userId: 'user123',
        title: 'Updated Title',
        description: 'Updated description',
        url: 'https://updated-example.com',
      };

      const existingLink = {
        id: 'link123',
        userId: 'user123',
        title: 'Old Title',
      };

      const updatedLink = {
        id: 'link123',
        title: 'Updated Title',
        slug: 'updated-title',
        description: 'Updated description',
        url: 'https://updated-example.com',
      };

      prismaService.link.findFirst.mockResolvedValue(existingLink);
      prismaService.link.update.mockResolvedValue(updatedLink);

      // ACT
      const result = await service.updateLink(updateData);

      // ASSERT
      expect(result).toEqual({
        status: 'success',
        message: 'Link updated successfully',
        link: updatedLink,
      });
      expect(prismaService.link.findFirst).toHaveBeenCalledWith({
        where: {
          id: updateData.linkId,
          userId: updateData.userId,
        },
      });
    });

    it('should throw BadRequestException when link does not exist', async () => {
      // ARRANGE
      const updateData = {
        linkId: 'nonexistent',
        userId: 'user123',
        title: 'Test',
        description: 'Test',
        url: 'https://test.com',
      };

      prismaService.link.findFirst.mockResolvedValue(null);

      // ACT & ASSERT
      await expect(service.updateLink(updateData)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.updateLink(updateData)).rejects.toThrow(
        'Link not found or you do not have permission to update it',
      );
    });
  });

  describe('deleteLink', () => {
    it('should delete a link successfully', async () => {
      // ARRANGE
      const deleteData = {
        linkId: 'link123',
        userId: 'user123',
      };

      const existingLink = {
        id: 'link123',
        userId: 'user123',
      };

      prismaService.link.findFirst.mockResolvedValue(existingLink);
      prismaService.link.delete.mockResolvedValue({});

      // ACT
      const result = await service.deleteLink(deleteData);

      // ASSERT
      expect(result).toEqual({
        status: 'success',
        message: 'Link deleted successfully',
      });
      expect(prismaService.link.delete).toHaveBeenCalledWith({
        where: { id: deleteData.linkId },
      });
    });

    it('should throw BadRequestException when link does not exist', async () => {
      // ARRANGE
      const deleteData = {
        linkId: 'nonexistent',
        userId: 'user123',
      };

      prismaService.link.findFirst.mockResolvedValue(null);

      // ACT & ASSERT
      await expect(service.deleteLink(deleteData)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
