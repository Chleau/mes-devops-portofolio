# Plan de Mise en Place des Tests Unitaires (Next.js 16)

Ce document décrit la stratégie pour intégrer les tests unitaires dans votre projet de portfolio Next.js.

## 1. Analyse et Choix Technologiques

Pour un projet Next.js 16 avec React 19 et TypeScript, la stack de test standard et la plus robuste est :
*   **Jest** : Le runner de test le plus populaire, rapide et complet.
*   **React Testing Library (RTL)** : Pour tester les composants React de manière centrée sur l'utilisateur (tester ce qui est affiché, pas l'implémentation interne).
*   **Jest Environment JSDOM** : Pour simuler un navigateur dans Node.js.
*   **ts-node** : Pour que Jest puisse comprendre les fichiers de config TypeScript sans compilation préalable complexe.

### Pourquoi ce choix ?
Next.js fournit une configuration Jest native qui simplifie grandement l'intégration avec `next/jest`. Cela gère automatiquement la compilation des fichiers `.tsx` et `.ts` et le support des nouvelles fonctionnalités de React.

## 2. Plan d'Action "Step-by-Step"

### Étape 1 : Installation des dépendances
Nous devons installer les bibliothèques de test en tant que dépendances de développement.

```bash
npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom ts-node
```

### Étape 2 : Configuration de Jest
Nous allons créer deux fichiers créés à la racine du projet :
1.  `jest.config.ts` : La configuration principale de Jest pour Next.js.
2.  `jest.setup.ts` : Un fichier pour étendre les matchers de Jest (ex: `toBeInTheDocument()`).

### Étape 3 : Création des Tests
Nous allons créer une structure de tests qui miroir l'architecture de votre application.
Les tests seront placés dans un dossier `__tests__` à la racine pour une séparation claire, ou à côté des composants (au choix, ici nous privilégierons `__tests__` pour ne pas encombrer les dossiers source).

**Fichiers à créer :**
*   `__tests__/Home.test.tsx` : Pour tester `app/page.tsx`
*   `__tests__/components/HeroSection.test.tsx` : Pour `HeroSection`
*   `__tests__/components/ExperiencesSection.test.tsx` : Pour `ExperiencesSection`
*   etc.

### Étape 4 : Ajout du Script
Ajouter la commande `"test": "jest"` et `"test:watch": "jest --watch"` dans le `package.json`.

### Étape 5 : Intégration GitHub Actions
Modifier le fichier `.github/workflows/main.yml` pour ajouter une étape de test avant le build et le déploiement. Cela garantit qu'aucun code cassé n'est déployé en production.

### Étape 6 : Intégration Docker (Optionnelle mais recommandée)
Créer une cible `test` dans le Dockerfile ou utiliser un conteneur temporaire pour lancer les tests en CI si on ne veut pas installer les dépendances sur le runner GitHub directement.

## 3. Détails des Tests à Implémenter

Pour votre demande ("tester l'affichage de ma page d'accueil du portfolio et de chaque sections"), voici les scénarios simples :

*   **Homepage** : Vérifier que le titre principal s'affiche.
*   **HeroSection** : Vérifier que le texte d'introduction et le bouton d'action sont présents.
*   **ExperiencesSection** : Vérifier que la liste des expériences n'est pas vide (ou qu'un élément clé est là).
*   **StackTechnique** : Vérifier que des icônes ou titres de technologies sont présents.
*   **ContactSection** : Vérifier la présence du formulaire ou de l'email.

## 4. Exemple de Code

### jest.config.ts
```typescript
import type { Config } from 'jest'
import nextJest from 'next/jest.js'
 
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})
 
// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    // Si vous utilisez des alias de chemin dans tsconfig.json (ex: @/...)
    '^@/(.*)$': '<rootDir>/$1',
  },
}
 
// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config)
```

### jest.setup.ts
```typescript
import '@testing-library/jest-dom'
```

---
**Prêt à exécuter ce plan ?** Je peux commencer par installer les dépendances et configurer les fichiers.
