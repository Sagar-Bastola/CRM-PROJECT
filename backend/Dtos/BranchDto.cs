namespace crm.Dtos;

public class BranchDto
{
    public int BranchID { get; set; }
    public string Name { get; set; } = null!;
}

public class CreateBranchDto
{
    public string Name { get; set; } = null!;
}

public class UpdateBranchDto
{
    public string Name { get; set; } = null!;
}