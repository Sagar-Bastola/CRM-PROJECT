using crm.DataContext;
using crm.Dtos;
using crm.Entities;
using crm.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace crm.Services.Implementations;

public class BranchService : IBranchService
{
    private readonly CrmDbContext _db;
    public BranchService(CrmDbContext db) => _db = db;

    public async Task<IEnumerable<BranchDto>> GetAllAsync() =>
        await _db.Branches.Select(b => new BranchDto { BranchID = b.BranchID, Name = b.Name }).ToListAsync();

    public async Task<BranchDto?> GetByIdAsync(int id)
    {
        var b = await _db.Branches.FindAsync(id);
        return b == null ? null : new BranchDto { BranchID = b.BranchID, Name = b.Name };
    }

    public async Task<BranchDto> CreateAsync(CreateBranchDto dto)
    {
        var branch = new Branch { Name = dto.Name };
        _db.Branches.Add(branch);
        await _db.SaveChangesAsync();
        return new BranchDto { BranchID = branch.BranchID, Name = branch.Name };
    }

    public async Task<BranchDto?> UpdateAsync(int id, UpdateBranchDto dto)
    {
        var branch = await _db.Branches.FindAsync(id);
        if (branch == null) return null;
        branch.Name = dto.Name;
        await _db.SaveChangesAsync();
        return new BranchDto { BranchID = branch.BranchID, Name = branch.Name };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var branch = await _db.Branches.FindAsync(id);
        if (branch == null) return false;
        _db.Branches.Remove(branch);
        await _db.SaveChangesAsync();
        return true;
    }
}