
import React from 'react';

import useDataFetch from '@/hooks/UseDataFetch';
import { GetServerSideProps } from 'next';
import {
    Hydrate,
    dehydrate,
    DehydratedState,
    QueryClient,
  } from "@tanstack/react-query";

interface User {
    id: number;
    firstName: string;
    lastName:string;
    age:number;
    email:string;
    phone:string;

}



const dataFetch = async () => {
    const response = await fetch('https://dummyjson.com/users');
    const data = await response.json();
    return data.users;
};

function UsersData() {
    
  const {data:users}=useDataFetch<User[]>('https://dummyjson.com/users','user')
   

    return (
             <div>
            
            <h1>Server Side Rendering with TanStack Query</h1>
          
            <ul>
                {users?.map((user) => (
                    <li key={user.id}><span>first name- {user.firstName}</span><br />
                      <span>last name- {user.lastName}</span><br />
                      <span>age-{user.age}</span><br />
                      <span>email-{user.email}</span><br />
                    </li>
                ))}
            </ul>
        </div>
    
       
    );
};

export const getServerSideProps: GetServerSideProps = async () => {
  
    const queryClient = new QueryClient();

     await queryClient.prefetchQuery({
        queryKey: ['user'],
        queryFn:dataFetch,
      })
   

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
           
        },
    };
};


export default function UsersInitial({
    dehydratedState,
  }: {
    dehydratedState: DehydratedState;
  }) {
    return (
        <Hydrate state={dehydratedState}>
        <UsersData/>
      </Hydrate>
    );
  }