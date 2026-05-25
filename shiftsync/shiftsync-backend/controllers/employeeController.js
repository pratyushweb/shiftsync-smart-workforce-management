import User from '../models/User.js';

export const getEmployees = async (req, res, next) => {
  try {
    // Find all users in the same business who are employees
    const employees = await User.find({ 
      businessId: req.user.businessId,
      role: 'employee' 
    });
    
    // Map jobTitle to role in response so frontend gets job roles seamlessly
    const mappedEmployees = employees.map(emp => {
      const obj = emp.toObject();
      obj.role = emp.jobTitle || 'Employee';
      return obj;
    });
    
    res.status(200).json({ success: true, data: mappedEmployees });
  } catch (error) {
    next(error);
  }
};

export const createEmployee = async (req, res, next) => {
  const { fullName, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const employee = await User.create({
      fullName,
      email,
      password: password || 'EmployeePassword123',
      role: 'employee',
      jobTitle: role || 'Employee',
      businessId: req.user.businessId
    });

    const obj = employee.toObject();
    obj.role = employee.jobTitle || 'Employee';

    res.status(201).json({ success: true, data: obj });
  } catch (error) {
    next(error);
  }
};

export const updateEmployee = async (req, res, next) => {
  const { id } = req.params;
  const { name, role } = req.body; // frontend passes name (fullName) and role (jobTitle)

  try {
    const employee = await User.findOne({
      _id: id,
      businessId: req.user.businessId,
      role: 'employee'
    });

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    if (name) employee.fullName = name;
    if (role) employee.jobTitle = role;

    await employee.save();

    const obj = employee.toObject();
    obj.role = employee.jobTitle || 'Employee';

    res.status(200).json({ success: true, data: obj });
  } catch (error) {
    next(error);
  }
};
