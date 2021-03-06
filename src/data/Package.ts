import StringUtils from "../StringUtils";
import Setting from "../Setting";
import ResourceComponent from './ResourceComponent';
import { ResourceComponentType } from './ResourceComponentType';
import Path from '../Path';

export default class Package {
    id: string = "";
    name: string = "";
    rootPath: string = "";
    genCode: boolean = false;

    public resources: Map<string, ResourceComponent> = new Map<string,ResourceComponent>();
    public components: ResourceComponent[] = [];
    public exportComponents: ResourceComponent[] = [];
    public sounds: ResourceComponent[] = [];
    
    public get ComponentList(): ResourceComponent[] {
        return this.components;
    }

    private _dependPackages: Package[] = [];
    public get dependPackages(): Package[] {
        if(this._dependPackages.length == 0) {
            let map = new Map<string, Package>();
            for(let com of this.exportComponents) {
                for(let pkg of com.dependPackageList) {
                    map.set(pkg.name, pkg);
                }
            }
            this._dependPackages = [...map.values()];
        }
        return this._dependPackages;
    }

    public AddResource(res: ResourceComponent) {
        res.package = this;
        this.resources.set(res.id, res);
        // console.log('res.type = ', res.type)
        if(res.type == ResourceComponentType.component) {
            // console.log(`package resourse length = ${this.components.length}`)
            this.components.push(res);
            if(res.exported) {
                this.exportComponents.push(res);
            }
        }else if(res.type == ResourceComponentType.sound) {
            this.sounds.push(res);
        }
    }
    
    public GetResource(resId: string) {
        if(this.resources.has(resId))
            return this.resources.get(resId);
        return null;
    }

    private _importList: any[] = [];
    public get importList(): any[] {
        if(!this._importList) {
            this._importList = [];
            for(let com of this.exportComponents) {
                this._importList.push(Path.GetImportParams(com,true));
            }
        }
        return this._importList;
    }

    private _codeFolderName: string = "";
    public get codeFolderName(): string
    {
        if(!this._codeFolderName)
        {
            this._codeFolderName = this.name.replace(/[^A-Za-z0-9_]/,"_");
        }
        return this._codeFolderName;
    }
    public set codeFolderName(v: string)
    {
        this._codeFolderName = v;
    }

    private _nameSpace: string = "";
    public get nameSpace(): string
    {
        if(!this._nameSpace)
        {
            this._nameSpace = this.codeFolderName;
            if(Setting.Options.codeNamespace)
                this._nameSpace = Setting.Options.codeNamespace + "." + this._nameSpace;
        }
        return this._nameSpace;
    }
    public set nameSpace(name: string)
    {
        this._nameSpace = name;
    }


    private _classNameBinder: string = "";
    public get classNameBinder(): string
    {
        if(!this._classNameBinder)
        {
            this._classNameBinder = StringUtils.FirstUpper(this.codeFolderName) + "Binder";
        }
        return this._classNameBinder;
    }
    public set classNameBinder(v: string)
    {
        this._classNameBinder = v;
    }
}