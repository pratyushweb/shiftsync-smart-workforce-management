/**
 * Simulates a high-quality AI scheduling response.
 * In production, this would call the Anthropic Claude API.
 */
export const generateScheduleFromClaude = async (employees, availabilities, config) => {
  const { startDate, endDate } = config;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  console.log(`[AI Engine] Generating optimized schedule from ${startDate} to ${endDate}...`);
  
  const suggestedShifts = [];
  let currentDate = new Date(start);

  while (currentDate <= end) {
    const dateStr = currentDate.toISOString().split('T')[0];

    
    // For each date, we want a Morning, Afternoon, and Night shift for different roles
    const roles = ['Server', 'Cook', 'Host'];
    
    roles.forEach((role, index) => {
      // Find employees with this role
      const qualifiedEmployees = employees.filter(e => e.role.toLowerCase() === role.toLowerCase());
      
      if (qualifiedEmployees.length > 0) {
        // Pick a random qualified employee
        const employee = qualifiedEmployees[Math.floor(Math.random() * qualifiedEmployees.length)];
        
        // Define shift times based on index
        let startTime, endTime;
        if (index === 0) { startTime = '08:00'; endTime = '16:00'; }
        else if (index === 1) { startTime = '16:00'; endTime = '23:00'; }
        else { startTime = '10:00'; endTime = '18:00'; }

        suggestedShifts.push({
          employeeId: employee._id || employee.id, // Handle both MongoDB _id and mock id
          title: `${role} Shift`,
          role: role,
          shiftDate: currentDate.toISOString(),
          startTime,
          endTime,
          status: 'draft' // AI shifts start as drafts
        });
      }
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }


  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return suggestedShifts;
};

