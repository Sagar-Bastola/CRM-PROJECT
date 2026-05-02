namespace crm.Entities;

public class Equipmentcategory
{
    public int CategoryID { get; set; }
    public string Name { get; set; } = null!;

    public ICollection<Equipment> Equipment { get; set; } = new List<Equipment>();
}