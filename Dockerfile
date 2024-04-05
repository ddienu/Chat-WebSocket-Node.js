# Seleccionamos la imagen.
FROM node:20-alpine

# Espacio de trabajo
WORKDIR /app

# Copiamos el archivo package.json
COPY package*.json ./

# Ejecutamos las intalaciones de las dependencias.
RUN npm install

# Copiamos los demas archivos están en el proyecto
COPY . ./

# Ejecutamos el poryecto...Puede ser con los scripts o con el comando nativo (node index.js)
CMD ["npm", "start"]