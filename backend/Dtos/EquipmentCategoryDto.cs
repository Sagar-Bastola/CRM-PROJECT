namespace crm.Dtos;

public class EquipmentCategoryDto
{
    public int CategoryID { get; set; }
    public string Name { get; set; } = null!;
}

public class CreateEquipmentCategoryDto
{
    public string Name { get; set; } = null!;
}

public class UpdateEquipmentCategoryDto
{
    public string Name { get; set; } = null!;
}