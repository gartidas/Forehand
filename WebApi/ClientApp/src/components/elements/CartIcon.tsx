import { Flex, Icon, Text } from '@chakra-ui/react'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { useOrders } from '../../contextProviders/OrdersProvider'

const CartIcon = () => {
  const { orderItemsCount } = useOrders()

  return (
    <Flex width='full' justifyContent='center'>
      <Icon as={AiOutlineShoppingCart} />
      <Flex
        backgroundColor='green.300'
        marginTop='-2'
        marginLeft='8'
        position='absolute'
        height={3}
        width={3}
        borderRadius='50%'
        justifyContent='center'
      >
        <Text p={0} m={0} fontSize='xx-small' fontWeight='bold' textAlign='center'>
          {orderItemsCount}
        </Text>
      </Flex>
    </Flex>
  )
}

export default CartIcon
