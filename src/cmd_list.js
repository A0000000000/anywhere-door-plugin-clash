import fs from 'fs'
import cmdConstant from './cmd_constant.js'

export default {
    'help': async function (cmds, extend) {
        return await new Promise((resolve, reject) => {
            fs.readFile('src/help', 'utf8', (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    },
    'mode': async function (cmds, extend) {
        const arr = []
        if (cmds.length < 2) {
            return cmdConstant.RESULT_CMD_PARAMS_ERROR
        }
        const type = cmds[1]
        if (type.toLowerCase() !== 'rule' || type.toLowerCase() !== 'global' || type.toLowerCase() !== 'direct') {
            return cmdConstant.RESULT_NO_MODE
        }
        const beforeConfig = (await extend.axiosClash.get('/configs')).data
        if (type.toLowerCase() === beforeConfig.mode.toLowerCase()) {
            return cmdConstant.RESULT_SUCCESS_NO_CHANGE
        }
        const result = await extend.axiosClash.patch('/configs', {
            'mode': type
        })
        const afterConfig = (await extend.axiosClash.get('/configs')).data
        if (type.toLowerCase() === afterConfig.mode.toLowerCase()) {
            return cmdConstant.RESULT_SUCCESS
        } else {
            return cmdConstant.RESULT_FAILED
        }
    }
}
