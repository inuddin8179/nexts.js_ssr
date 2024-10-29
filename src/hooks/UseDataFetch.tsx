import { useQuery, UseQueryResult } from '@tanstack/react-query';

function useDataFetch<T>(url: string, key: string,initialData?: T): UseQueryResult<T> {
    return useQuery<T>({
        queryKey: [key],
        queryFn: async () => {
            if (!url) {
                throw new Error('No URL provided');
            }
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data.users; 
        },
        enabled: !!url, 
        initialData,
    });
}

export default useDataFetch;
