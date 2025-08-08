"use client"

import { Button, Group, Modal, NumberInput, RangeSlider, Select, SimpleGrid, Stack, Tabs, TabsList, TabsTab, Text, TextInput, Textarea } from "@mantine/core";
import Image from "next/image";
import JobCard from "./components/JobCard";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DateInput, DatePickerInput } from "@mantine/dates";
import Header from "./components/Header";
import { IconChevronDown, IconChevronsDown, IconCurrencyRupee, IconMapPin, IconMapPin2, IconSearch, IconUserQuestion } from "@tabler/icons-react";


export default function Home() {

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm();

  const [opened,setOpened] = useState(false);
  const [data,setData] = useState([]);
  const [fileredData,setFilteredData] = useState([]);
  const [loading,setLoading] = useState(false);
 
  const[filters,setFilters] = useState({
    search: "",
    location: "",
    type: "",
    salary: [5,100]
  });
  
  const fetchjobs = async () => {
    try{
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`);
      if (!res.ok) throw new Error("failed to fetch jobs");
      const jobs = await res.json();
      setData(jobs)
      setFilteredData(jobs)
    } catch (err) {
      console.error("Error loading jobs:", err)
    }
  };

 useEffect(() => {
  fetchjobs();
 },[])

 useEffect(() => {
  const { search, location, type, salary } = filters;

  const result = data.filter((job) => {
    const titleMatch = job.job_title.toLowerCase().includes(search.toLowerCase());
    const locationMatch = location ? job.location === location : true;
    const typeMatch = type ? job.type === type : true;
    const salaryMatch = (
      job.salary_min >= salary[0] * 1000 &&
      job.salary_max <= salary[1] * 1000
    );

    return titleMatch && locationMatch && typeMatch && salaryMatch;
  });
  setFilteredData(result);
  }, [filters, data]);

  useEffect(() => {
    if (!opened) {
      reset({
        deadline:null
      });
    }
  }, [opened,reset]);

  const onSubmit = async (formData) => {
    try {
      console.log(formData)
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job_title: formData.title,
          company_name: formData.company,
          type: formData.jobType,
          location: formData.location,
          salary_min: Number(formData.salaryMin.slice(2)),
          salary_max: Number(formData.salaryMax.slice(2)),
          deadline: new Date(formData.deadline).toISOString(),
          description: formData.description,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error from backend:', errorData);
        setLoading(false)
        throw new Error('Failed to submit job data');
      }
  
      const data = await response.json();
      console.log('Job created successfully:', data);
      setLoading(false)
      setOpened(false)
      reset()
      await fetchjobs();
    } catch (error) {
      console.error('Error submitting form:', error.message);
    }
  };

  return (
    <>
      <div className="pb-3">
          <Header onCreateJobClick={() => setOpened(true)}/>
      </div>
      <div className="shadow pb-1">  
          <Group mb="lg" grow gap={"lg"} justify="center" wrap="false" mx={"xl"}>
            <TextInput variant="unstyled"
              placeholder="Search by Job Title, Role"
              leftSection={<IconSearch size={16}/>}
              classNames={{
                root: "border-r !border-r-gray-400 ",
              }
              }
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            />
            <Select  px={"auto"} variant="unstyled"
              data={[
                { label: 'Chennai', value: 'CHENNAI' },
                { label: 'Bangalore', value: 'BANGALORE' },
                { label: 'Hyderabad', value: 'HYDRABAD' },
                { label: 'Pune', value: 'PUNE' },
              ]}
              rightSection={<IconChevronDown size={16}/>}
              leftSection={<IconMapPin size={16}/>}
              classNames={{
                root: "border-r !border-r-gray-400 ",
              }
              }
              placeholder="Preferred Location"
              value={filters.location}
              onChange={(val) => setFilters((f) => ({ ...f, location: val }))}
            />
            <Select variant="unstyled"
              rightSection={<IconChevronDown size={16}/>}
              leftSection={<IconUserQuestion size={16}/>}
              data={[
                { label: 'Full Time', value: 'FULLTIME' },
                { label: 'Part Time', value: 'PARTTIME' },
                { label: 'Internship', value: 'INTERNSHIP' },
                { label: 'Contract', value: 'CONTRACT' },
              ]}
              placeholder="Job Type"
              value={filters.type}
              onChange={(val) => setFilters((f) => ({ ...f, type: val }))}
            />
            <div>
              <div className="flex justify-between">
                <span className="font-medium text-base">Salary Per Month</span>
                <span className="font-medium text-base">₹{filters.salary[0]}k - ₹{filters.salary[1]}k</span>
                
              </div>
              <RangeSlider
              color="rgba(0,0,0,1)"
              min={5}
              max={100}
              label={null}
              classNames={{
                track: "!h-0.5 "
              }}
              onChange={(val) => setFilters((f) => ({ ...f, salary: val }))}
              />
            </div>
            
        </Group>
      </div>
      <div>
        <SimpleGrid cols={{base:1, sm:2, lg:4}} spacing={"xl"} px={"xl"} pt={"sm"} verticalSpacing={"xl"}>
          {
            fileredData.map((job) =>
              <JobCard key={job.id} job={job}/>
            )
          }
        </SimpleGrid>
      </div>

      <div>
          <>
            <Modal
              opened={opened}
              onClose={() => setOpened(false)}
              title="Create Job Opening"
              size="auto"
              centered
              classNames={{
                title: "text-center w-full !font-semibold !text-base",
                content: "!rounded-xl p-2 !h-4/5 !w-3/5"
              }}
            >
              <form 
              onSubmit={handleSubmit(onSubmit)}
              >
                <Stack spacing="md" gap={"md"}>
                  <Group justify="space-between" gap={"lg"} grow>
                    <TextInput
                      w={"full"}
                      radius={"md"}
                      label="Job Title"
                      placeholder="e.g., Full Stack Developer"
                      error={errors.title && 'Required'}
                      {...register('title', { required: true })}
                    />
                    <TextInput
                      radius={"md"}
                      label="Company Name"
                      placeholder="Amazon, Microsoft, Swiggy"
                      error={errors.company && 'Required'}
                      {...register('company', { required: true })}
                    />
                  </Group>

                  <Group grow>
                    <Select
                      label="Location"
                      radius={"md"}
                      withCheckIcon={false}
                      rightSection={<IconChevronDown size={16}/>}
                      placeholder="Choose Preferred Location"
                      data={[
                        { label: 'Chennai', value: 'CHENNAI' },
                        { label: 'Bangalore', value: 'BANGALORE' },
                        { label: 'Hyderabad', value: 'HYDRABAD' },
                        { label: 'Pune', value: 'PUNE' },
                      ]}
                      error={errors.location && 'Required'}
                      {...register('location', { required: true })}
                      onChange={(val) => {
                        setValue('location', val);
                        clearErrors("location")}}
                    />
                    <Select
                      withCheckIcon={false}
                      radius={"md"}
                      placeholder="FullTime"
                      rightSection={<IconChevronDown size={16}/>}
                      label="Job Type"
                      data={[
                        { label: 'Full Time', value: 'FULLTIME' },
                        { label: 'Part Time', value: 'PARTTIME' },
                        { label: 'Internship', value: 'INTERNSHIP' },
                        { label: 'Contract', value: 'CONTRACT' },
                      ]}
                      {...register('jobType', { required: true })}
                      onChange={(val) => {
                        setValue('jobType', val)
                        clearErrors("jobType")}}
                      error={errors.jobType && 'Required'}
                    />
                  </Group>
                  <Group grow>
                    <Stack gap={"xs"}>
                      
                      <Group grow gap={"xs"}>
                        <NumberInput
                        radius={"md"}
                          prefix="₹ "
                          label="Salary Range"
                          placeholder="₹0"
                          value={watch('salaryMin')}
                          min={0}
                          hideControls
                          {...register('salaryMin', { required: true })}
                          error={errors.salaryMin && 'Required'}
                          onChange={(val) => {
                            setValue('salaryMin', val || null)
                            clearErrors("salaryMin")}}
                        />
                        <NumberInput
                        classNames={{
                          wrapper: "!mt-6"
                        }}

                          radius={"md"}
                          prefix="₹ "
                          value={watch('salaryMax')}
                          error={errors.salaryMax && 'Required'}
                          placeholder="₹12,00,000"
                          hideControls
                          {...register('salaryMax', { required: true })}
                          onChange={(val) => {
                            setValue('salaryMax', val,)
                            clearErrors("salaryMax")}}
                        />
                      </Group>
                    </Stack>
                    <DatePickerInput
                      label="Application Deadline"
                      radius={"md"}
                      placeholder="Application deadline"
                      value={watch('deadline')}
                      {...register('deadline', { required: true })}
                      onChange={(date) => {
                        setValue('deadline', date);
                        clearErrors("deadline")}}
                      error={errors.deadline && 'Required'}
                      size="sm"
                    />

                  </Group>

                  <Textarea
                    label="Job Description"
                    radius={"md"}
                    placeholder="Please share a description to let the candidate know more about the job role"
                    minRows={6}
                    autosize
                    {...register('description', {required:true})}
                    error={errors.description && 'Required'}
                  />

                  <Group justify="space-between" mt="md">
                    <Button variant="default" justify="center" 
                    radius={"md"} px={"xl"}
                    rightSection={<IconChevronsDown size={16}/>} >
                      Save Draft
                    </Button>
                    <Button type="submit" px={"xl"} radius={"md"} loading={loading}>
                      Publish »
                    </Button>
                  </Group>
                </Stack>
              </form>
            </Modal>
          </>
      </div>
    </>
  );
}
