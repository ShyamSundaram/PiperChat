FROM node

RUN groupadd -r shyam && useradd -r -g shyam shyam

RUN chsh -s /usr/sbin/nologin root

WORKDIR /app
COPY package.json .
RUN npm install
COPY . ./
EXPOSE 3000
CMD ["npm","run","devStart"]