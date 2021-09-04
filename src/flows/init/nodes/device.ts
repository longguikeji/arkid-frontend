import { AuthApiNode } from '@/arkfbp/nodes/authApiNode'
import { getDevice, getDeviceId } from '@/utils/device'
import { UserModule } from '@/store/modules/user'
import { ConfigModule } from '@/store/modules/config'

export class DeviceNode extends AuthApiNode {

  async run() {
    if (window.location.pathname === '/login') {
      const device = getDevice()
      const deviceId = await getDeviceId()
      const userUUId = UserModule.uuid
      this.url = '/api/v1/device/'
      this.method = 'POST'
      this.params = {
        device_type: device.type,
        system_version: device.os,
        browser_version: device.browser,
        mac_address: '',
        device_number: '',
        device_id: deviceId,
        account_ids: [ userUUId ]
      }
    }
  }

}