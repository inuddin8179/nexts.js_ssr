import React from "react";
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next';
import {
    dehydrate,
    DehydratedState,
    Hydrate,
    QueryClient,
    useQuery
  } from "@tanstack/react-query";

interface User {
    id: number;
    firstName: string;
    lastName:string;
    age:number;
    email:string;
    phone:string;

}
const dataFetch= async (slug: string) => {
   
    const res = await fetch(`https://dummyjson.com/users/${slug}`);
    if (!res.ok) {
      throw new Error('User not found');
    }
    return res.json();
  };
   

export const getServerSideProps: GetServerSideProps = async (context)=>{
    
    const{slug}=context.query;
  
    const queryClient = new QueryClient();
     await queryClient.prefetchQuery({
        queryKey: [slug],
        queryFn:()=>dataFetch(slug as string)
      })
      
      return{
        props:{
            dehydratedState: dehydrate(queryClient),
        }
      }
}
function UserInformation(){
    
    const router = useRouter();
    const { slug } = router.query;
    

    
    const {data:eachuser}=useQuery<User>({
       queryKey:[slug],
       queryFn:()=>dataFetch(slug as string),
       enabled: !!slug,  
    })
 
     
  return (
    <div>
      <h1 >{eachuser?.id } -User Details</h1>
      <ul>
        <li key={eachuser?.id}>
          <strong>first name:</strong> {eachuser?.firstName} <br />
          <strong>last name:</strong> {eachuser?.lastName} <br />
          <strong>Email:</strong> {eachuser?.email} <br />
          <strong>age:</strong> {eachuser?.age} <br /> 
        </li>
      </ul>
    </div>
  );
};

export default function UserInformationRouter({
    dehydratedState,
  }: {
    dehydratedState: DehydratedState;
  }) {
    return (
        <Hydrate state={dehydratedState}>
        <UserInformation/>
      </Hydrate>
    );
  }