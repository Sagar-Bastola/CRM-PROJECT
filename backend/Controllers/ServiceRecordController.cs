using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using crm.DataContext;
using crm.Entities;
using crm.Dtos;

namespace crm.Controllers;

[ApiController]
[Route("api/equipment/{equipmentId}/service-records")]
public class ServiceRecordsController : ControllerBase
{
    private readonly CrmDbContext _context;

    public ServiceRecordsController(CrmDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(int equipmentId)
    {
        var records = await _context.ServiceRecords
            .Where(s => s.EquipmentID == equipmentId && !s.Deleted)
            .OrderByDescending(s => s.ServiceDate)
            .Select(s => new ServiceRecordDto
            {
                ServiceRecordID = s.ServiceRecordID,
                EquipmentID = s.EquipmentID,
                ServiceType = s.ServiceType,
                ServiceDate = s.ServiceDate,
                Description = s.Description,
                Cost = s.Cost,
                TechnicianName = s.TechnicianName,
                NextServiceDate = s.NextServiceDate,
                CreatedAt = s.CreatedAt,
            })
            .ToListAsync();

        return Ok(records);
    }

    [HttpPost]
    public async Task<IActionResult> Create(int equipmentId, [FromBody] CreateServiceRecordDto dto)
    {
        var equipment = await _context.Equipment.FindAsync(equipmentId);
        if (equipment == null) return NotFound();

        var record = new ServiceRecord
        {
            EquipmentID = equipmentId,
            ServiceType = dto.ServiceType,
            ServiceDate = dto.ServiceDate,
            Description = dto.Description,
            Cost = dto.Cost,
            TechnicianName = dto.TechnicianName,
            NextServiceDate = dto.NextServiceDate,
        };

        _context.ServiceRecords.Add(record);

        equipment.LastServiceDate = dto.ServiceDate;
        equipment.LastModified = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(record);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int equipmentId, int id)
    {
        var record = await _context.ServiceRecords
            .FirstOrDefaultAsync(s => s.ServiceRecordID == id && s.EquipmentID == equipmentId);

        if (record == null) return NotFound();

        record.Deleted = true;
        await _context.SaveChangesAsync();
        return NoContent();
    }
}