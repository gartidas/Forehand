import { Flex, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import { NAVBAR_HEIGHT } from '../../components/modules/Navbar/Navbar'
import useWindowSize from '../../utils/hooks/useWindowsSize'
import ChangePassword from './ChangePassword'

const Settings = () => {
  const isDesktop = useWindowSize().height > 1100

  return (
    <Flex height={`calc(100vh - ${NAVBAR_HEIGHT})`} align={'center'} justify={'center'}>
      <Tabs
        size={'md'}
        variant='enclosed'
        isFitted
        overflowY='auto'
        height={isDesktop ? 'auto' : '100%'}
      >
        <TabList position='sticky' top={0} zIndex={99} backgroundColor='bg' margin={1}>
          <Tab>Password</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <ChangePassword />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  )
}

export default Settings
