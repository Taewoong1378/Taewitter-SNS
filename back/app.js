const express = require('express');
const app = express();

const indexRouter = require('./routes');
const postRouter = require('./routes/post');

sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });
  
app.use('/', indexRouter);
app.use('/post', postRouter);

app.get('/posts', (req, res) => {
    res.json([
        { id: 1, content: 'hello'},
        { id: 2, content: 'hello2'},
        { id: 3, content: 'hello3'},
    ]);
});


app.listen(3065, () => {
    console.log('서버 실행 중');
})