import Package from "../data/Package";
import Path from '../Path';
import TsPathTemplate from "./TsPathTemplate";
import TsPathOut from "./TsPathOut";
import { TemplateSystem } from "../TemplateSystem";

export default class TSExportBinder
{
    public static Export(pkg: Package)
    {
        let coms = [];
        for(let component of pkg.ComponentList)
        {
            if(component.exported)
                coms.push([component.classNameExtend]);
        }

        let template: TemplateSystem = new TemplateSystem(Path.ReadTxt(TsPathTemplate.Binder));
        template.AddVariable("imports",pkg.importList);
        template.AddVariable("coms",coms);
        template.AddVariable("className",pkg.classNameBinder);
        let content = template.Parse();
        let path = TsPathOut.Binder.format(pkg.codeFolderName,pkg.classNameBinder);

        Path.CheckPath(path);
        Path.WriteTxt(path,content);

    }
}