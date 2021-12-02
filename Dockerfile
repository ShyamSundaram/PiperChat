FROM node

RUN groupadd -r shyam && useradd -r -g shyam shyam

WORKDIR /app
COPY package.json .
RUN npm install
COPY . ./
EXPOSE 3000
CMD ["npm","run","devStart"]