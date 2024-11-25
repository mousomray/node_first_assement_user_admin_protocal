class homeuicontroller {
    async home(req, res) {
        return res.render('homeview/home', { user: req.user })
    }
}

module.exports = new homeuicontroller();