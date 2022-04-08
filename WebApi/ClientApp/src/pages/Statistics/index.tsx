import { Flex, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import { NAVBAR_HEIGHT } from '../../components/modules/Navbar/Navbar'
import useWindowSize from '../../utils/hooks/useWindowsSize'
import Courts from './Charts/Courts'
import DayPreference from './Charts/DayPreference'
import TimePreference from './Charts/TimePreference'
import Trainers from './Charts/Trainers'

const Statistics = () => {
  const isDesktop = useWindowSize().height > 1100

  return (
    <Flex
      height={`calc(100vh - ${NAVBAR_HEIGHT})`}
      align={'center'}
      justify={'center'}
      paddingTop={5}
    >
      <Tabs
        size={'md'}
        variant='enclosed'
        isFitted
        overflowY='auto'
        height={isDesktop ? 'auto' : '100%'}
        isLazy
      >
        <TabList
          position='sticky'
          top={0}
          zIndex={99}
          backgroundColor='bg'
          padding={1}
          overflowX='auto'
        >
          <Tab color='#68D391' _selected={{ color: '#68D391', fontWeight: 'bold' }}>
            Courts
          </Tab>
          <Tab color='#68D391' _selected={{ color: '#68D391', fontWeight: 'bold' }}>
            Trainers
          </Tab>
          <Tab color='#68D391' _selected={{ color: '#68D391', fontWeight: 'bold' }}>
            Day preference
          </Tab>
          <Tab color='#68D391' _selected={{ color: '#68D391', fontWeight: 'bold' }}>
            Time preference
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Courts />
          </TabPanel>
          <TabPanel>
            <Trainers />
          </TabPanel>
          <TabPanel>
            <DayPreference />
          </TabPanel>
          <TabPanel>
            <TimePreference />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  )
}

export default Statistics
