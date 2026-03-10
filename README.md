# Todo App — Projet TP Liora

Stack : **Vite + React** (frontend) · **Django + DRF + SimpleJWT** (backend) · **SQLite** (dev)

---

## Structure

```
todo-app/
├── backend/
│   ├── config/          # settings, urls, wsgi
│   ├── tasks/           # modèle, serializer, views, urls
│   ├── tests/           # tests pytest (models + API)
│   ├── requirements.txt
│   ├── pytest.ini
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── assets/      # images,
│   │   │   └── css/         # styles de l'application
│   │   ├── components/  # TaskItem, TaskList, AddTaskForm, LoginForm
│   │   ├── context/     # AuthContext (JWT)
│   │   ├── services/    # api.js
│   │   └── tests/       # Vitest + RTL
│   ├── cypress/         # Tests E2E
│   ├── cypress.config.js
│   ├── vite.config.js
│   └── package.json
└── .github/workflows/   # CI GitHub Actions
```

---

## Installation

### Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Tests

### Backend (Pytest)
```bash
cd backend
pytest                        # tous les tests
pytest tests/test_models.py   # tests modèles uniquement
pytest tests/test_api.py      # tests API uniquement
pytest -v --tb=short          # verbose
```

### Frontend (Vitest + RTL)
```bash
cd frontend
npm test               # run once
npm run test:watch     # watch mode
npm run test:coverage  # avec rapport de couverture
```

### E2E (Cypress)
```bash
# Prérequis : backend + frontend démarrés
# Créer l'utilisateur de test :
cd backend && python manage.py shell -c "
from django.contrib.auth.models import User
User.objects.create_user('testuser', password='testpass123')
"

cd frontend
npm run cy:open   # mode interactif
npm run cy:run    # mode headless (utilisé sur MAc car imppossible de faire fonctionner la premiere commande)
```

---

## Endpoints API

| Méthode | URL | Description |
|---------|-----|-------------|
| POST | `/api/auth/token/` | Obtenir access + refresh tokens |
| POST | `/api/auth/token/refresh/` | Rafraîchir le token |
| GET | `/api/tasks/` | Liste des tâches (filtre: `?category=travail`) |
| POST | `/api/tasks/` | Créer une tâche |
| PATCH | `/api/tasks/{id}/` | Modifier une tâche |
| DELETE | `/api/tasks/{id}/` | Supprimer une tâche |

---

## Catégories disponibles

`travail` · `perso` · `courses` · `autre`
