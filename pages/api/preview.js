// pages/api/preview.js
export default function handler(req, res) {
    res.setPreviewData({});
    res.redirect(req.query.redirect || '/');
}