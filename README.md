TypeScript Inversifyjs Backend
===

Development
---


### Common:
Run:
- `npm install`
- `start_db_dev.sh` - to start postgres and redis in development mode

### tsi-service-rest:
Run:
1. `cd services/tsi-service-rest`
2. `npm install`
3. `. start_dev.sh`

### tsi-service-data:
Run:
1. `cd services/tsi-service-products`
2. `npm install`
3. `. db_migrate_dev.sh`
4. `. start_dev.sh`

### tsi-service-notification:
Run:
1. `cd services/tsi-service-notification`
2. `npm install`
3. `. start_dev.sh`

### tsi-service-payment:
Run:
1. `cd services/tsi-service-payment`
2. `npm install`
3. `. start_dev.sh`

###Init new sequelize config folder:
Run:
```
npx sequelize-cli init $* --options-path sequelizerc/generate.sequelizerc
```

####Generate new migration
Go to the folder with the service in which you want to create the migration
```
npx sequelize-cli migration:generate $* --options-path sequelizerc/generate.sequelizerc --name <MIGRATION NAME>
```

####Generate new seed
Go to the folder with the service in which you want to create the seed
```
npx sequelize-cli seed:generate $* --options-path sequelizerc/generate.sequelizerc --name <SEED NAME>
```

Deployment
---

Run:
1. Enter the project directory;
2. `cd ./launch/${environment}` - where `environment` can take the following values:
    - `development`;
    - `staging`;
    - `production`;
   

* To the start application in `staging` environment, you need to run one of the following commands:
    - `. start_stage.sh` - on the first launch;
    - `. restart_stage.sh` - when changing containers;
    - `. stop_stage.sh` - if you need to stop containers;
    - `. remove_stage.sh` - if you need to stop and remove containers;
    - `. remove_stage_with_volumes.sh` - if you need to stop and remove containers with docker volumes.
   

* To the start application in `production` environment, you need to run one of the following commands:
   - `. start_prod.sh` - on the first launch;
   - `. restart_prod.sh` - when changing containers;
   - `. stop_prod.sh` - if you need to stop containers;
   - `. remove_prod.sh` - if you need to stop and remove containers;
   - `. remove_prod_with_volumes.sh` - if you need to stop and remove containers with docker volumes.
   There is no dockerized database in production docker-compose file.
   
   **NOTE**: remove all folders, which satisfy the pattern `/volume*` before launching the last command
