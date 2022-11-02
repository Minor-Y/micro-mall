import axios from 'axios'
import api from '../../api/index'

// 保存操作记录
export async function saveProcesslog(operate_module, operate_content) {
    // 获取ip地址
    const ip = returnCitySN.cip
    const {data: ress} = await axios.get(`${api.localUrl}/pconlineIp`, {
        params: returnCitySN
    })
    if(ress.status !== 200) return this.$message.error('ip获取失败, 请刷新重试')
    const addr = ress.data.ipdata.info1 + ress.data.ipdata.info2
    // 获取当前时间
    const nowTime = Date.now().toString().slice(0, 10)
    const userName = window.sessionStorage.getItem('username')
    const processLogs = {
        operate_account: userName,
        operate_module: operate_module,
        operate_time: nowTime,
        operate_ip: ip,
        operate_content: operate_content,
        operate_addr: addr
    }
    const res = await axios.post(`${api.localUrl}/addProcessLog`, {
        processLogs
    })
    if(res.status !== 200) return this.$message.error('操作日志保存失败')
}