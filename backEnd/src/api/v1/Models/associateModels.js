// This file sets up associations between models to avoid circular dependencies.
import SignupData from './Signup.model.js';
import Student from './studentData.model.js';

// Define associations after both models are imported
SignupData.hasOne(Student, {
    foreignKey: 'signupId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

Student.belongsTo(SignupData, {
    foreignKey: 'signupId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

export { SignupData, Student };
