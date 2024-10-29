include .env.local

start_postgresql:
	postgres -D ${POSTGRES_DATA_PATH}

start:
	make start_postgresql & go run main.go

migrateup:
	@echo Migrating up...
	migrate -path db/migration -database ${POSTGRES_URL} -verbose up
	@echo Migration done

migratedown:
	migrate -path db/migration -database ${POSTGRES_URL} -verbose down

migratecreate:
	# make migratecreate name=create_users
	migrate create -ext sql -dir db/migration -seq $(name)