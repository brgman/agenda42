# Nom de l'image Docker
IMAGE_NAME=agenda-app
DEV_PORT = 3002
PORT = 4200

# Lancement en mode développement avec .env.local
# TODO: for dev he take port 3002 from package.json
dev:
	npx kill-port $(DEV_PORT)
	npx env-cmd -f .env.local npm run dev

# Construction de l'image Docker
docker-build:
	docker build -t $(IMAGE_NAME) .

# Lancement du conteneur Docker
docker-run:
	docker run --env-file .env.production -p $(PORT):$(PORT) $(IMAGE_NAME)

# Construction et lancement du conteneur Docker
docker-up: docker-build docker-run

# Arrêt et suppression du conteneur Docker
docker-down:
	docker stop $$(docker ps -q --filter ancestor=$(IMAGE_NAME)) || true
	docker rm $$(docker ps -a -q --filter ancestor=$(IMAGE_NAME)) || true

# Nettoyage des images et conteneurs Docker
docker-clean:
	docker rmi $(IMAGE_NAME) || true

# Reconstruction complète (nettoyage et construction)
docker-rebuild: docker-down docker-clean docker-build

# Logs en temps réel
docker-logs:
	docker logs --tail 10000 -f $(SERVICE_NAME)

# Accès à un shell dans le conteneur
docker-shell:
	docker exec $(SERVICE_NAME) sh
