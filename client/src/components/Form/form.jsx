import Button from "../UI/Button"
import Input from "../UI/Input"

const form = ({ fields, handleSubmit, isSubmitDisabled, ctaText }) => {
    return (
        <form className='mt-4' onSubmit={handleSubmit} >
            {fields.map(field => <Input key={field.name} {...field} />)}
            <Button type='submit' isDisabled={isSubmitDisabled} classes="bg-black disabled:opacity-55 w-full rounded-md text-white text-base py-2 text-center" text={ctaText} />
        </form>
    )
}

export default form