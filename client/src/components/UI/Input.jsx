import PropTypes from 'prop-types';

const Input = ({ label, placeholder, inputType, name, value, styleType, handleChange, inputRef, classes }) => {

    const inputClass = styleType === 'user' ? 'outline-none rounded-lg border-2 py-2 px-3 border-gray-200' : 'w-full p-3 pb-2 outline-none';

    if (inputType !== 'textarea')

        return (
            <div className="flex flex-col gap-2">
                {label && <label htmlFor={name} className="text-base font-bold">{label}</label>}
                <input ref={inputRef} type={inputType} className={`${inputClass} ${classes}`} id={name} name={name} placeholder={placeholder} onChange={handleChange} value={value} />
            </div>
        )

    return (
        <div className="flex flex-col gap-2">
            {label && <label htmlFor={name} className="text-base font-bold">{label}</label>}
            <textarea rows="1" ref={inputRef} className={`w-full px-3 py-2 outline-none resize-none overflow-hidden ${classes}`} id={name} name={name} placeholder={placeholder} onChange={handleChange} value={value}></textarea>
        </div>
    )
}

Input.propTypes = {
    label: PropTypes.string,
    placeholder: PropTypes.string,
    inputType: PropTypes.oneOf(['text', 'email', 'password', 'textarea', 'range']),
    name: PropTypes.string.isRequired,
    handleChange: PropTypes.func,
    styleType: PropTypes.oneOf(['user', 'notes']),
    inputRef: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({ current: PropTypes.instanceOf(Element) })
    ])
}

Input.defaultProps = {
    label: null,
    placeholder: null,
    inputType: 'text',
    styleType: 'user',
    handleChange: () => { },
}

export default Input