import {Student} from '../Models/modelsImportExport.mjs'; // Adjust path to your Student model

export const deleteStudentData = async (req, res) => {
  const { id } = req.params;



  try {
    // Find the student by primary key (id)
    const student = await Student.findByPk(id);


    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Delete the student
    await student.destroy();

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Error deleting student' });
  }
};