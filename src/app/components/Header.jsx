import {Image, Tabs, TabsList, TabsTab } from '@mantine/core'
import React from 'react';

const Header = ({ onCreateJobClick }) => {
  return (
    <div className='w-full flex justify-center'>

        <div className='flex items-center justify-center px-6 py-3 rounded-full shadow gap-6 lg:w-[890px]'>
        <Image
            src="tesla.png"
            alt='logo'
            w={45}
            h={45}
        />
            <Tabs variant="pills" color="grape" radius={"xl"} defaultValue="create-jobs"
             color="rgba(157, 0, 255, 1)" >
            <TabsList >
                <TabsTab value="home">
                Home
                </TabsTab>
                <TabsTab value="find-jobs">
                Find Jobs
                </TabsTab>
                <TabsTab value="find-talents">
                Find Talents
                </TabsTab>
                <TabsTab value="about-us">
                About Us
                </TabsTab>
                <TabsTab value="testtimonials">
                Testimonials
                </TabsTab>
                <TabsTab value="create-jobs"
                onClick={onCreateJobClick}>
                Create Jobs
                </TabsTab>
            </TabsList>
            </Tabs>

        </div>
    </div>

  )
}

export default Header