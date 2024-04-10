import { calculatePagesCount } from '../helper';
import { QUERY_KEY } from './key';
import { useQuery, keepPreviousData } from "@tanstack/react-query";

interface IUser {
    id: string,
    name: string,
    email: string
}

export const PAGE_SIZE = 2;

export const useFetchUser = (currentPage: number) => {
    const queryInfo = useQuery({// gan data cho users
        queryKey: QUERY_KEY.getUserPaginate(currentPage),
        queryFn: async (): Promise<any> =>
            fetch(`http://localhost:8000/users?_page=${currentPage}&_limit=${PAGE_SIZE}`)
                .then(async (res) => {
                    const total_items = +(res.headers.get('X-Total-Count') ?? 0);
                    const totalPages = calculatePagesCount(PAGE_SIZE, total_items);
                    const d = await res.json();
                    return {
                        total_items, totalPages, users: d
                    }
                }),
        placeholderData: keepPreviousData,
    })
    return {
        ...queryInfo,
        data: queryInfo?.data?.users ?? [],
        count: queryInfo?.data?.total_items ?? 0,
        totalPages: queryInfo?.data?.totalPages ?? 0,
    }
}