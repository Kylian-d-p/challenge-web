# Cronjob - Génération automatique des cours

## Description

Ce cronjob génère automatiquement les cours pour les 12 prochaines semaines en se basant sur les cours planifiés dans la table `ScheduledCourses`.

## Configuration

### Variables d'environnement

Ajoutez cette variable dans votre fichier `.env` :

```env
CRON_SECRET="your-secret-key-change-this-in-production"
```

**Important** : Générez une clé secrète aléatoire et sécurisée pour la production.

### Planification

Le cronjob est configuré pour s'exécuter **tous les lundis à 8h00** (cron: `0 8 * * 1`).

Configuration dans `vercel.json` :

```json
{
  "crons": [
    {
      "path": "/api/cron/generate-courses",
      "schedule": "0 8 * * 1"
    }
  ]
}
```

## Fonctionnement

1. **Récupération** : Le script récupère tous les cours planifiés depuis `ScheduledCourses`
2. **Génération** : Pour chaque cours planifié, il crée 12 occurrences (une par semaine) pour les 12 prochaines semaines
3. **Vérification** : Il vérifie que le cours n'existe pas déjà avant de le créer
4. **Création** : Les cours sont créés en masse dans la table `Courses`

## Tester manuellement

Pour tester le cronjob manuellement, utilisez curl ou un outil similaire :

```bash
curl -X GET http://localhost:3000/api/cron/generate-courses \
  -H "Authorization: Bearer your-secret-key-change-this-in-production"
```

## Structure des données

### ScheduledCourses

- `activityId` : ID de l'activité
- `dayOfWeek` : Jour de la semaine (1=Lundi, 2=Mardi, ..., 7=Dimanche)
- `startTime` : Heure de début au format "HH:MM"
- `capacity` : Capacité maximale

### Courses (générés)

- `activityId` : ID de l'activité
- `startDateTime` : Date et heure du cours
- `capacity` : Capacité maximale

## Réponse API

```json
{
  "message": "Génération des cours terminée",
  "created": 24,
  "scheduled": 2,
  "weeksGenerated": 12,
  "nextMondayStart": "2026-01-13"
}
```

## Déploiement sur Vercel

1. Assurez-vous que `vercel.json` est présent à la racine du projet
2. Ajoutez `CRON_SECRET` dans les variables d'environnement de votre projet Vercel
3. Déployez votre application

Vercel détectera automatiquement la configuration du cronjob et l'activera.

## Notes importantes

- Les cours en doublon sont automatiquement ignorés (`skipDuplicates: true`)
- Le script génère les cours à partir du lundi suivant la date d'exécution
- Tous les logs sont visibles dans la console Vercel ou dans les logs du serveur
