FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install --only=prod --legacy-peer-deps
COPY . .

CMD ["npm", "start"]
# 

# to build a docker image
# docker build -t noderestapi.v1:latest .

# to run this image
# docker run -d -t -p 4023:4023 --name noderestapi-v1 noderestapi.v1
# run with volume mounting
#/root/.npm/_logs/
# docker run -dt -p 4023:4023 --name noderestapi-v1 -v /home/admyn/Desktop/logs:/app/logs noderestapi.v1
#
# docker run -p $PORT1:$PORT1 -e PORT1=$PORT1 --name noderestapi-v1 -v /home/admyn/Desktop/logs:/root/.npm/_logs/ noderestapi.v1
# 
# docker run -p 80:80 --name container_instance_name -v noderestapilogs/noderestapifileshare:/app/logs dockertestpaddy.azurecr.io/noderestapi.v1
#
#docker run -p 80:80 --name noderestapi-mariadb -v noderestapilogs/noderestapifileshare:/app/logs dockertestpaddy.azurecr.io/noderestapi.v1

# to save docker file for export over to windows: 
#docker save -o noderestapi.v1.tar noderestapi.v1:latest

#docker login once container registry is created
# docker login login_server_name -u admin_username -p password
# e.g 
# docker login dockertestpaddy.azurecr.io -u DockerTestPaddy -p oWpRZpe2bvhUJDhX=1h89FcJ0zkJwEGg

#load image on windows
# docker load -i noderestapi.v1.tar

#tag image to appropriate registry 
# docker tag noderestapi.v1 dockertestpaddy.azurecr.io/noderestapi.v1

#push to container registry
# docker push dockertestpaddy.azurecr.io/noderestapi.v1

# mariadb
# docker run -d --restart always --name mariadb1 -p 3308:3306 -e MARIADB_ROOT_PASSWORD=dsaewq321 -v /home/admyn/ROOT/Docker/MariaDB/data/config:/etc/mysql/conf.d -v /home/admyn/ROOT/Docker/MariaDB/data/db:/var/lib/mysql bitnami/mariadb

# docker context create aci aci_name
#
#docker exec -it a4f093de9441 bash
#hostname -i