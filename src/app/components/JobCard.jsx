
import { Badge, Button, Card, CardSection, Group, Image, Text } from '@mantine/core'
import { IconBuilding, IconStack, IconUserPlus } from '@tabler/icons-react'
import React from 'react'



const JobCard = ({job}) => {

const hours = Math.floor((Date.now() - new Date(job.createdAt)) / (1000 * 60 * 60));

  return (
    <div className='relative'>

        <Card shadow='sm' radius="lg" p={"lg"} className='h-[36vh]'>
            <Group pos={"apart"} mb={"xs"} className='items-center flex-nowrap'>
                <Image src={job.img || "tesla.png"} h={60} w={60} radius={"md"} className='shadow-md p-1'/>
                <span className='bg-blue-200 p-1 rounded-lg absolute top-3 right-3 text-sm font-medium px-2'>
                    {hours >= 24 
                    ? `${Math.floor(hours / 24)} day${Math.floor(hours / 24) !== 1 ? 's' : ''}` 
                    : `${hours}h`} Ago
                </span> 
            </Group>
            <span className='font-semibold'>{job.job_title}</span>
            <Text size="sm" c={"gray"} mt={4} 
            classNames={{
                root: "flex items-center gap-3"
            }}>
                <span className='flex items-center gap-1'>
                    <IconUserPlus size={16}/> {job.experience || "1-3" } yr Exp
                </span>
                <span className='flex items-center gap-1'>
                    <IconBuilding size={16}/> {job.location}
                </span>
                <span className='flex items-center gap-1'>
                    <IconStack size={16}/> {job.salary_max/100000} LPA
                </span>
            </Text>
            <ul className="list-disc pl-5 text-sm text-gray-400 mt-3 pb-3">
                {job.description
                    .split("\n")
                    .filter(line => line.trim() !== "") 
                    .map((line, i) => (
                    <li key={i}>{line}</li>
                    ))}
            </ul>
            <Button  mt="md" color="blue" radius={"md"} color="rgba(0, 170, 255, 1)"
            pos={"absolute"} className='bottom-4 left-3 right-3'>
                Apply Now
            </Button>
        </Card>
        
    </div>
    
  )
}

export default JobCard