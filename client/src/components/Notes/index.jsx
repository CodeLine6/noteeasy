import Addnote from './Addnote';
import NotesList from './NotesList';
import ModifyNote from './Modal/Modifynote';
import NotesState from '../../context/Notes/NotesState';
import ModalState from '../../context/Modal/ModalContext';
import Search from './OptionsDialog';


const Notes = () => {

    console.log("Notes Component")
    return (
        <NotesState>
            <section className='w-11/12 sm:w-8/12 md:w-2/5 mt-10 mx-auto pb-5 flex gap-3 my-3'>
                <Addnote className='w-full' />
                {/* <Search /> */}
            </section>
            <ModalState>
                <ModifyNote />
                <NotesList />
            </ModalState>
        </NotesState>
    )
}


export default Notes

