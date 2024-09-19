include .env.local

migrateup:
	@echo Migrating up...
	migrate -path db/migration -database ${POSTGRES_URL} -verbose up
	@echo Migration done

migratedown:
	migrate -path db/migration -database ${POSTGRES_URL} -verbose down