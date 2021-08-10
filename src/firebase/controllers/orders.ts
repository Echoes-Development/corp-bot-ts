import fb from '../../firebase'
import { Order } from '../../types/order'
import { DataOrError } from '../../types/error_returns'

const createOrder = async (guildId: string, orderDetails: Order): Promise<DataOrError<string>> => {
  try {
    const orderId = await fb.firestore()
      .collection('guilds')
      .doc(guildId)
      .collection('orders')
      .add(orderDetails)
      .then((doc) => doc.id)
    return [orderId, null]
  } catch (e) {
    console.error(e)
    return [null, new Error('Unable to create order')]
  }
}

export {
  createOrder
}
