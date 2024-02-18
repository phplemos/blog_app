const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Categoria');
const CategoriaModel = mongoose.model("categorias");


router.get('/', (req, res) => {
    res.render('admin/index')
});

router.get('/posts', (req, res) => {
    res.send('Pagina de postagens');
});

router.get('/categorias', (req, res) => {
    CategoriaModel.find().sort({ date: 'desc' }).then((categorias) => {
        let listCategorias = [];
        categorias.map((categoria) => {
            listCategorias.push({
                id: categoria.id,
                nome: categoria.nome,
                slug: categoria.slug,
                date: categoria.date
            });
        });
        res.render('admin/categorias', { categorias: listCategorias });

    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao listar as categorias!');
        res.redirect('/admin');
    })
});

router.get('/categorias/add', (req, res) => {
    res.render('admin/addcategoria');
});

router.post('/categorias/nova', (req, res) => {

    var erros = [];

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({
            texto: "Nome invalido"
        });
    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({ texto: "Slug invalido" });
    }

    if (req.body.nome.length < 2) {
        erros.push({ texto: "Nome da categoria é muito pequeno" });
    }

    if (erros.length > 0) {
        res.render("admin/addcategoria", { erros: erros })
    } else {
        const reqCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
        const novaCategoria = new CategoriaModel(reqCategoria);
        novaCategoria.save().then(() => {
            req.flash('success_msg', 'Categoria criada com sucesso!');
            res.redirect('/admin/categorias');
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao salvar a categoria, tente novamente!')
            console.log(err);
            res.redirect('/admin')
        });

    }

});

router.get('/categorias/edit/:id', (req, res) => {
    CategoriaModel.findOne({ _id: req.params.id }).then((categoria) => {
        let response = { nome: categoria.nome };
        res.render('admin/editcategorias', {
            categoria: {
                id: req.params.id,
                nome: categoria.nome,
                slug:categoria.slug
            }
        });
    }).catch((err) => {
        req.flash('error_msg', 'Essa categoria não existe');
        console.log(err);
        res.redirect('/admin/categorias');
    });
});

router.post('/categorias/edit',(req,res)=>{
    CategoriaModel.findOne({_id:req.body.id}).then((categoria)=>{
        categoria.nome = req.body.nome;
        categoria.slug = req.body.slug;

        categoria.save().then(()=>{
            req.flash('success_msg','Categoria editada com sucesso!');
            res.redirect('/admin/categorias');
        }).catch((err)=>{
            req.flash('error_msg', 'Houve um erro interno ao salvar a edição da categoria!');
            res.redirect('/admin/categorias');
        })

    }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro ao editar a categoria!');
        res.redirect('/admin/categorias');
    })
});

router.post('/categorias/deletar',(req,res)=>{
    CategoriaModel.deleteOne({_id:req.body.id}).then(()=>{
        req.flash('success_msg','Categoria deletada com sucesso!');
        res.redirect('/admin/categorias');
    }).catch((err)=>{
        req.flash('error_msg','Houve um erro ao deletar a categoria!');
        req.redirect('/admin/categorias');
    });
});

router.get('/postagens',(req,res)=>{
    res.render('admin/postagens');
});

router.get('/postagens/add',(req,res)=>{
    res.render('admin/addpostagens')
});

module.exports = router;