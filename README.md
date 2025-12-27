# 🔗 Qify API - Smart Link Management Platform

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)](https://jwt.io/)
[![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)

## Vue d'ensemble

**Qify** est une API REST moderne et sécurisée pour la gestion de liens, développée avec **NestJS** et **TypeScript**. Cette plateforme offre un système complet d'authentification, de gestion de profils utilisateurs, et de création de liens personnalisés avec des fonctionnalités avancées de sécurité.

### Fonctionnalités principales

- **Authentification Google OAuth 2.0** avec JWT
- **Gestion complète des liens** (CRUD avec slug automatique)
- **Profils utilisateurs** publics/privés avec username unique
- **API publiques sécurisées** avec clés API
- **Rate limiting** multicouche pour prévenir les abus
- **Protection contre les attaques** par timing et bruteforce
- **Health checks** pour monitoring en production
- **Tests unitaires** complets avec Jest

---

## Architecture technique

### **Stack technologique**

```typescript
Framework     : NestJS v11 (Node.js)
Langage       : TypeScript
Base de données : PostgreSQL (Neon Cloud)
ORM           : Prisma v7
Authentification : JWT + Google OAuth 2.0
Tests         : Jest
Validation    : class-validator + class-transformer
```

### **Structure modulaire**

```
src/
├── v1/                      # API versionnée
│   ├── auth/               # Module d'authentification
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── jwt.strategy.ts
│   │   └── google-auth.service.ts
│   ├── link/               # Module de gestion des liens
│   │   ├── link.controller.ts
│   │   ├── link.service.ts
│   │   └── link.service.spec.ts
│   ├── profile/            # Module de gestion des profils
│   │   ├── profile.controller.ts
│   │   └── profile.service.ts
│   ├── public/             # Endpoints publics
│   │   ├── public.controller.ts
│   │   └── public.service.ts
│   ├── guard/              # Guards de sécurité
│   │   └── apikey.guard.ts
│   └── dto/                # Objets de transfert de données
│       ├── auth.dto.ts
│       ├── link.dto.ts
│       └── profile.dto.ts
├── prisma/                 # Configuration Prisma
│   ├── prisma.service.ts
│   └── prisma.module.ts
├── health/                 # Health checks
│   ├── health.controller.ts
│   └── health.service.ts
└── utils/                  # Utilitaires
    ├── generate-slug.ts
    └── extract-username.ts
```

---

## Architecture de sécurité

### **1. Authentification multicouche**

```typescript
// JWT Strategy pour les routes protégées
@UseGuards(ThrottlerGuard, AuthGuard('jwt'))

// API Key Guard pour les endpoints publics
@UseGuards(ThrottlerGuard, ApiKeyGuard)
```

### **2. Protection contre les attaques**

#### **Rate Limiting intelligent**

- **Short term** : 3 requêtes/seconde
- **Medium term** : 20 requêtes/minute
- **Long term** : 100 requêtes/15 minutes

#### **API Key Security**

- Comparaison sécurisée avec `timingSafeEqual()`
- Protection contre les attaques par timing
- Logging des tentatives d'accès invalides

#### **Validation des données**

```typescript
export class createLinkDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  title: string;

  @IsUrl()
  @MinLength(10)
  @MaxLength(300)
  url: string;
}
```

### **3. Base de données sécurisée**

```prisma
// Relations avec suppression en cascade
model User {
  id       String   @id @default(cuid())
  email    String   @unique
  links    Link[]
  profile  Profile?
}

// Username unique avec contrainte
model Profile {
  username String @unique
  status   Boolean @default(true) // Public/Privé
}
```

---

## 🚀 Installation et démarrage

### **Prérequis**

- Node.js ≥ 18.0.0
- PostgreSQL database
- Compte Google Cloud (OAuth)

### **1. Cloner le projet**

```bash
git clone https://github.com/your-username/qify-api.git
cd qify-api
```

### **2. Installer les dépendances**

```bash
npm install
```

### **3. Configuration des variables d'environnement**

```env
# .env
DATABASE_URL="postgresql://user:password@host:5432/database"

JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="30d"

GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_ID_IOS="your-google-ios-client-id"

API_KEY="sk_live_your-secure-api-key-here"
```

### **4. Configurer la base de données**

```bash
# Générer le client Prisma
npx prisma generate

# Lancer les migrations
npx prisma migrate deploy

# (Optionnel) Visualiser les données
npx prisma studio
```

### **5. Lancer en développement**

```bash
npm run start:dev
```

L'API sera accessible sur `http://localhost:3000`

---

## 📡 Endpoints API

### **🔐 Authentification**

| Méthode | Endpoint              | Description                | Auth |
| ------- | --------------------- | -------------------------- | ---- |
| `POST`  | `/api/v1/auth/google` | Connexion via Google OAuth | -    |

### **🔗 Gestion des liens**

| Méthode  | Endpoint                     | Description              | Auth |
| -------- | ---------------------------- | ------------------------ | ---- |
| `GET`    | `/api/v1/link/all`           | Récupérer tous les liens | JWT  |
| `POST`   | `/api/v1/link/create`        | Créer un nouveau lien    | JWT  |
| `PUT`    | `/api/v1/link/update`        | Modifier un lien         | JWT  |
| `PUT`    | `/api/v1/link/change-status` | Activer/Désactiver       | JWT  |
| `DELETE` | `/api/v1/link/delete`        | Supprimer un lien        | JWT  |

### **👤 Profils utilisateurs**

| Méthode | Endpoint                          | Description         | Auth |
| ------- | --------------------------------- | ------------------- | ---- |
| `GET`   | `/api/v1/profile/my-profile`      | Mon profil          | JWT  |
| `GET`   | `/api/v1/profile/:username`       | Profil par username | JWT  |
| `POST`  | `/api/v1/profile/create-username` | Créer username      | JWT  |
| `PUT`   | `/api/v1/profile/update-username` | Modifier username   | JWT  |
| `PUT`   | `/api/v1/profile/update-status`   | Public/Privé        | JWT  |

### **🌐 Endpoints publics**

| Méthode | Endpoint                           | Description   | Auth    |
| ------- | ---------------------------------- | ------------- | ------- |
| `GET`   | `/api/v1/public/profile/:username` | Profil public | API Key |

### **🏥 Health & Monitoring**

| Méthode | Endpoint      | Description            | Auth |
| ------- | ------------- | ---------------------- | ---- |
| `GET`   | `/api/health` | État de l'API          | -    |
| `GET`   | `/`           | Informations générales | -    |

---

### **Exemple de test unitaire**

```typescript
describe('LinkService', () => {
  describe('createLink', () => {
    it('should create a link successfully', async () => {
      // ARRANGE
      const createLinkDto = {
        title: 'Test Link',
        url: 'https://example.com',
        userId: 'user123',
      };

      // ACT
      const result = await service.createLink(createLinkDto);

      // ASSERT
      expect(result).toEqual({
        status: 'success',
        message: 'Link created successfully',
        link: expect.objectContaining({
          title: 'Test Link',
          slug: 'test-link',
        }),
      });
    });
  });
});
```

---

### **Couverture des tests**

- **Services** : 95%+ de couverture
- **Controllers** : 90%+ de couverture
- **Guards** : 100% de couverture

### **Performance**

-**Response time** : < 100ms (moyenne)

- **Rate limiting** : Protection multicouche
- **Memory usage** : Optimisé avec Prisma

### **Sécurité**

- **Authentification** : JWT + OAuth 2.0
- **Validation** : class-validator strict
- **Rate limiting** : ThrottlerGuard
- **API Keys** : Protection timing-safe

---

---

## 🤝 Contribution

Ce projet suit les standards de développement modernes :

- ✅ **Convention commits** : `feat:`, `fix:`, `docs:`
- ✅ **ESLint + Prettier** : Code formaté automatiquement
- ✅ **Tests obligatoires** : Couverture minimale 80%
- ✅ **TypeScript strict** : Typage complet

---

## 📞 Contact

**Développeur** : Kevin  
**Email** : k.nimi73@gmail.com

---

## Licence

## Ce projet est sous licence **MIT**.

## Roadmap

### **Version 2.0** (Q1 2025)

- [ ] **WebSockets** pour notifications temps réel
- [ ] **RevenueCat ou Stripe** pour les abonements
- [ ] **Analytics** avancées des liens avec sanity
- [ ] **API GraphQL** en complément du REST
- [ ] **Cache Redis** pour optimisation
- [ ] **Documentation Swagger** automatique
- [ ] **Docker containerization**
- [ ] **CI/CD Pipeline** avec GitHub Actions

---

_Développé avec ❤️ en utilisant les meilleures pratiques de développement moderne_
