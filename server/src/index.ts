import app from './app';

const PORT = process.env.PORT || 5000;

app.get('/h', (req,res)=>{
    res.send('api ran');
})

app.listen(PORT, () =>{
    console.log(`Server running on ${PORT}`)
})