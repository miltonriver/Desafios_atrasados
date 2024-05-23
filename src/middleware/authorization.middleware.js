const authorization = role => {
    return async (req, res, next) => {
        if (!req.user) return res.status(401).json({status: 'error', error: 'Unauthorized'})
        if (req.user.role !== role) return res.status(401).json ({status: 'error', error: 'No posee los permisos necesarios'})
        next()
    }
}

export default authorization