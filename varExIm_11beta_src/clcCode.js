
function export_variables()
{
    var var_count = Project.Variables.VariableCount;
    var name, type, value;
    var path, fso, file;
    
    UserForms.ctcForm.SaveDialog1.Execute();
    path = UserForms.ctcForm.SaveDialog1.FileName;
    
    fso = new ActiveXObject("Scripting.FileSystemObject");
    file = fso.OpenTextFile(path, 2, true);    
    
    for (var i=0; i<var_count; i++)
    {
        name = Project.Variables.GetVariableName(i);
        value = Project.Variables.VariableByName(name);
        type = Project.Variables.GetVariableType(i);
        var record = new Array(name, value, type);
        file.WriteLine(record);
    }
    
    file.Close();
}


function import_variables()
{
    var dialog = UserForms.dialog
    var path, fso, file, set;
    
    UserForms.ctcForm.OpenDialog1.Execute();
    path = UserForms.ctcForm.OpenDialog1.FileName;
    
    if (path)
    {
        fso = new ActiveXObject("Scripting.FileSystemObject");
        file = fso.OpenTextFile(path, 1); 
    
        while (!file.AtEndOfStream)
        {
            record = file.ReadLine().split(",");
            try
            {
                Project.Variables.AddVariable(record[0], record[2]);
            }
            catch(exception)
            {
                gui_dialog("Unable to import variable: "+record[0], exception);
            }
        }
    
        file.Close(); 
    } 
    else
    {
        gui_dialog("You have not selected the file for import!", "");
    } 
}



function gui_dialog(label1, label2)
{
    var dialog = UserForms.dialog
    dialog.Caption = "Import variables";
    dialog.cxLabel1.Caption = label1;
    dialog.cxLabel2.Caption = label2;
    dialog.ShowModal();
    
}

