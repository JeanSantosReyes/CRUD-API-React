// Axios Config
import TutorialApi from '../api/TutorialApi';
// Interfaces
import ITutorialData from '../types/Tutorial';

export const getAllItem = () => {
    return TutorialApi.get<Array<ITutorialData>>('/tutorials')
}

export const getItem = (id: string) => {
    return TutorialApi.get<ITutorialData>(`/tutorials/${id}`)
}

export const createItem = (data: ITutorialData) => {
    return TutorialApi.post<ITutorialData>('/tutorials', data)
}

export const updateItem = (id: string, data: ITutorialData) => {
    return TutorialApi.put<any>(`/tutorials/${id}`, data)
}

export const removeItem = (id: string) => {
    return TutorialApi.delete<any>(`/tutorials/${id}`)
}

export const removeAllItems = () => {
    return TutorialApi.delete<any>('/tutorials')
}

export const findItemByTitle = (title: string) => {
    return TutorialApi.get<Array<ITutorialData>>(`/tutorials?title=${title}`)
}