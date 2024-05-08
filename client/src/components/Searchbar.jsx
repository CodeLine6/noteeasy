import React from 'react'
import Input from './UI/Input'
import { SearchContext } from '../context/SearchContext'

const Searchbar = () => {
    const { setSearchTerm } = React.useContext(SearchContext);
    return (
        <Input placeholder="Search" name="title" styleType='notes' handleChange={e => setSearchTerm(e.target.value.trim())} />
    )
}

export const DesktopSearch = () => {
    return <div className='w-8/12 md:w-2/5 rounded-lg border border-gray-300 shadow-sm overflow-hidden bg-white' >
        <Searchbar />
    </div>
}