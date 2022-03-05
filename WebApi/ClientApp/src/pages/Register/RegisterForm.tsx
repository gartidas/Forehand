import { Flex, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import { NAVBAR_HEIGHT } from '../../components/modules/Navbar/Navbar'
import { Role } from '../../domainTypes'
import roleColors from '../../styles/roleColors'
import useWindowSize from '../../utils/hooks/useWindowsSize'
import BasicRegistration from './BasicRegistration'
import TrainerRegistration from './TrainerRegistration'

const RegisterForm = () => {
  const isDesktop = useWindowSize().height > 1100

  return (
    <Flex height={`calc(100vh - ${NAVBAR_HEIGHT})`} align={'center'} justify={'center'}>
      <Tabs
        size='md'
        variant='enclosed'
        isFitted
        overflowY='auto'
        height={isDesktop ? 'auto' : '100%'}
      >
        <TabList position='sticky' top={0} zIndex={99} backgroundColor='bg' margin={1}>
          <Tab _selected={{ color: roleColors[Role.BasicUser], fontWeight: 'bold' }}>Customer</Tab>
          <Tab _selected={{ color: roleColors[Role.Employee], fontWeight: 'bold' }}>Employee</Tab>
          <Tab _selected={{ color: roleColors[Role.Trainer], fontWeight: 'bold' }}>Trainer</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <BasicRegistration role={Role.BasicUser} />
          </TabPanel>
          <TabPanel>
            <BasicRegistration role={Role.Employee} />
          </TabPanel>
          <TabPanel>
            <TrainerRegistration />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  )
}

export default RegisterForm
