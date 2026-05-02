using crm.Dtos;
using crm.Entities;

namespace crm.Extensions.MappingExtensions;

public static class BranchMappingExtensions
{
    public static BranchDto ToDto(this Branch branch) => new()
    {
        BranchID = branch.BranchID,
        Name = branch.Name
    };

    public static Branch ToEntity(this CreateBranchDto dto) => new()
    {
        Name = dto.Name
    };

    public static void UpdateEntity(this UpdateBranchDto dto, Branch branch)
    {
        branch.Name = dto.Name;
    }
}