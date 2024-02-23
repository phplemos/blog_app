const { json } = require('body-parser');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Categoria');
const CategoriaModel = mongoose.model('categorias');
require('../models/Postagem')
const PostagemModel = mongoose.model('postagens')


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
        new CategoriaModel(reqCategoria).save().then(() => {
            req.flash('success_msg', 'Categoria criada com sucesso!');
            res.redirect('/admin/categorias');
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao salvar a categoria, tente novamente!')
            res.redirect('/admin/categorias')
        });

    }

});

router.get('/categorias/edit/:id', (req, res) => {
    CategoriaModel.findOne({ _id: req.params.id }).then((categoria) => {
        res.render('admin/editcategorias', {
            categoria: {
                id: req.params.id,
                nome: categoria.nome,
                slug: categoria.slug
            }
        });
    }).catch((err) => {
        req.flash('error_msg', 'Essa categoria não existe');
        res.redirect('/admin/categorias');
    });
});

router.post('/categorias/edit', (req, res) => {
    CategoriaModel.findOne({ _id: req.body.id }).then((categoria) => {
        categoria.nome = req.body.nome;
        categoria.slug = req.body.slug;

        categoria.save().then(() => {
            req.flash('success_msg', 'Categoria editada com sucesso!');
            res.redirect('/admin/categorias');
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro interno ao salvar a edição da categoria!');
            res.redirect('/admin/categorias');
        })

    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao editar a categoria!');
        res.redirect('/admin/categorias');
    })
});

router.post('/categorias/deletar', (req, res) => {
    CategoriaModel.deleteOne({ _id: req.body.id }).then(() => {
        req.flash('success_msg', 'Categoria deletada com sucesso!');
        res.redirect('/admin/categorias');
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao deletar a categoria!');
        req.redirect('/admin/categorias');
    });
});

router.get('/postagens', (req, res) => {
    PostagemModel.find().populate('categoria').exec().then((postagens) => {
        let listPostagens = [];
        postagens.map((postagem) => {
            listPostagens.push({
                id: postagem._id,
                titulo: postagem.titulo,
                slug: postagem.slug,
                descricao: postagem.descricao,
                conteudo: postagem.conteudo,
                data: postagem.data,
                categoria: {
                    id: postagem.categoria._id,
                    nome: postagem.categoria.nome
                }
            });
        });
        res.render('admin/postagens', { postagens: listPostagens });
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao listar as postagens');
        res.redirect('/admin')
    })
});

router.get('/postagens/add', (req, res) => {
    CategoriaModel.find().then((categoria) => {
        listCategorias = [];
        categoria.map((categoria) => {
            listCategorias.push({
                id: categoria.id,
                nome: categoria.nome,
                slug: categoria.slug,
                date: categoria.date
            });
        });

        res.render('admin/addpostagens', { categorias: listCategorias });
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao listar as categorias');
        res.redirect('/admin/postagens');
    });
});

router.post('/postagens/nova', (req, res) => {
    let erros = []
    if (req.body.categoria == 0) {
        erros.push({ text: "Categoria invalida, registre uma categoria" });
    }
    if (erros.length > 0) {
        res.render('admin/addpostagens', { erros: erros })
    } else {
        const reqPostagem = {
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
        }
        new PostagemModel(reqPostagem).save().then(() => {
            req.flash('success_msg', 'Postagem registrada com sucesso!');
            res.redirect('/admin/postagens');
        }).catch((err) => {
            req.flash('error_msg', 'Erro ao cadastrar a postagem');
            res.redirect('/admin/postagens');
        });
    }
});

router.get('/postagens/edit/:id', (req, res) => {
    PostagemModel.findOne({ _id: req.params.id }).then((postagem) => {
        CategoriaModel.find().then((categorias) => {
            res.render('admin/editpostagens', {
                postagem: postagem,
                categorias:categorias
            });
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao listar as categorias');
            res.redirect('/admin/postagens');
        });
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao carregar o formulario de edição');
        res.redirect('/admin/postagens');
    });



})

router.post('/postagens/edit', (req, res) => {
    PostagemModel.findOne({ _id: req.body.id }).then((postagem) => {
        postagem.titulo = req.body.titulo;
        postagem.slug = req.body.slug;
        postagem.descricao = req.body.descricao;
        postagem.conteudo = req.body.conteudo;
        postagem.categoria = req.body.categoria;
        postagem.save().then(() => {
            req.flash('success_msg', 'Postagem editada com sucesso!');
            res.redirect('/admin/postagens');
        }).catch((err) => {
            req.flash('error_msg', 'Erro Interno');
            res.redirect('/admin/postagens');
        });
    }).catch((err) => {
        console.log(err)
        req.flash('error_msg', 'Houve um erro ao salvar a edição');
        res.redirect('/admin/postagens')
    })
})

module.exports = router;