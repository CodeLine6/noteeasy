import { useEffect, useState } from 'react'
import { IoCloseSharp } from "react-icons/io5";


const TagInput = ({ customStyle, tagsValue, tagsSetter = null }) => {
    const [tags, setTags] = useState(tagsValue.current)
    if (tagsSetter) tagsSetter.current = setTags;
    const addTag = (e) => {
        if (!e.target.value.trim()) return
        let newTag = e.target.value.trim();
        let updatedTags = tags.concat(newTag)
        setTags(updatedTags)
        tagsValue.current = updatedTags
        e.target.value = null
    }

    const handleKeyDown = (e) => {
        if (e['code'] == 'Enter') {
            addTag(e)
        }

        else if (e['code'] == 'Backspace') {
            if (e.target.value === '') {
                let updatedTags = tags.slice(0, tags.length - 1)
                setTags(updatedTags)
                tagsValue.current = updatedTags
            }
        }
    }

    const handleRemoveTag = (idx) => {
        const updatedTags = tags.filter((tag, index) => index !== idx)
        setTags(updatedTags)
        tagsValue.current = updatedTags
    }

    return (
        <div id='tags-container' className={`flex flex-wrap gap-2 ${customStyle}`}>
            {tags.map((tag, index) => (
                <div key={index} className='tag-item rounded-full bg-slate-300 px-2 py-1 flex items-center justify-around gap-2 cursor-pointer text-sm'><span>{tag}</span> <span className='bg-black text-white rounded-full flex items-center justify-center p-[1px] ' onClick={() => handleRemoveTag(index)}><IoCloseSharp /></span>
                </div>
            ))}
            <input type="text" className='outline-none flex-1' style={{ width: 0 }} placeholder='Add a Tag...' autoFocus onKeyDown={handleKeyDown} onBlur={addTag} />
        </div>
    )
}

export default TagInput